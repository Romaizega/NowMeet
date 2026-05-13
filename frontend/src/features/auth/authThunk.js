import {createAsyncThunk} from '@reduxjs/toolkit'
import api from '../../services/axios'


const registerUser = createAsyncThunk(
  'auth/registerUser',
  async({username, email, password}, {rejectWithValue}) => {
    try {
      const {data} = await api.post('/auth/register', {username, email, password})
      return data
    } catch (error) {
      const message = error.response?.data.message || error.message || 'Registration failed'
      return rejectWithValue(message)
     }
    }
)

export {
  registerUser
}