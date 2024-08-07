'use client'
import {Box, Stack, Typography, Button, Modal, TextField, IconButton, Switch, CssBaseline} from '@mui/material'
import {firestore} from '@/firebase'
import {collection, doc, query, getDocs, setDoc, deleteDoc, addDoc, getDoc} from 'firebase/firestore'
import {useEffect, useState, useMemo} from 'react'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import SearchIcon from '@mui/icons-material/Search'
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Home() {
  const [pantry, setPantry] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [itemName, setItemName] = useState('')

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'))
    const docs = await getDocs(snapshot)
    const pantryList = []
    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() })
    })
    console.log(pantryList)
    setPantry(pantryList)
  }

  useEffect(() => {
    updatePantry()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    // Check if exists
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { count } = docSnap.data()
      await setDoc(docRef, { count: count + 1 })
    } else {
      await setDoc(docRef, { count: 1 })
    }
    await updatePantry()
  }

  const increaseItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { count } = docSnap.data()
      await setDoc(docRef, { count: count + 1 })
    }
    await updatePantry()
  }

  const decreaseItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { count } = docSnap.data()
      if (count === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { count: count - 1 })
      }
    }
    await updatePantry()
  }

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)
    if (query === '') {
      setSearchResults(pantry)
    } else {
      const results = pantry.filter(item => item.name.toLowerCase().includes(query))
      setSearchResults(results)
    }
  }

  useEffect(() => {
    setSearchResults(pantry)
  }, [pantry])

  const [mode, setMode] = useState('light')
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
      },
    }),
    [],
  )

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          p: 2,
          bgcolor: 'background.default',
          color: 'text.primary'
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center">
          <Typography variant="h3" sx={{ flexGrow: 1 }}>
            Pantry Management
          </Typography>
          <IconButton onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Item
            </Typography>
            <Stack width="100%" direction={"row"} spacing={2}>
              <TextField 
                id="outlined-basic" 
                label="Item" 
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button variant="contained" color="primary"
                onClick={() => {
                  addItem(itemName)
                  setItemName('')
                  handleClose()
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add New Item
        </Button>
        <Stack direction="row" spacing={2} alignItems="center" mb={2} sx={{ width: "100%", maxWidth: "800px" }}>
          <TextField 
            id="search" 
            label="Search Pantry" 
            variant="outlined" 
            fullWidth
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <SearchIcon color="action" />
              )
            }}
          />
        </Stack>
        <Box border={'1px solid #ddd'} width="100%" maxWidth="800px" borderRadius={2} p={2} bgcolor={'background.paper'}>
          <Box 
            width="100%" 
            height="60px" 
            bgcolor={'primary.main'} 
            display={'flex'} 
            justifyContent={'center'}
            alignItems={'center'}
            borderRadius={2}
            mb={2}
            boxShadow={2}
          >
            <Typography variant={'h5'} color={'#fff'} textAlign={'center'}>
              Pantry Items
            </Typography>
          </Box>
          <Stack 
            width="100%" 
            spacing={2} 
            overflow={'auto'}
            maxHeight="400px"
            sx={{ '::-webkit-scrollbar': { display: 'none' } }}
          >
            {searchResults.map(({ name, count }) => (
              <Box
                key={name}
                width="100%"
                minHeight="80px"
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                bgcolor={'background.default'}
                paddingX={2}
                borderRadius={2}
                boxShadow={1}
                transition="all 0.3s ease"
                sx={{ '&:hover': { bgcolor: 'background.paper' } }}
              >
                <Typography
                  variant={'h6'}
                  color={'text.primary'}
                  textAlign={'center'}
                >
                  {
                    // Capitalize the first letter of the item
                    name.charAt(0).toUpperCase() + name.slice(1)
                  }
                </Typography>
                <Typography variant={'h6'} color={'text.primary'} textAlign={'center'}>
                  Quantity: {count}
                </Typography>
                <Box display={'flex'} gap={1}>
                  <IconButton color="secondary" onClick={() => decreaseItem(name)}>
                    <RemoveCircleIcon />
                  </IconButton>
                  <IconButton color="primary" onClick={() => increaseItem(name)}>
                    <AddCircleIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </ThemeProvider>
  )
}