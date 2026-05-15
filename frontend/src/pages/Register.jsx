import { useState, useEffect } from "react"
import {useDispatch, useSelector} from "react-redux"
import {useNavigate} from "react-router-dom"
import { registerUser } from "../features/auth/authThunk"


export default function Register () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {status, error} = useSelector ((state)=> state.auth)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError(null)
    if(username.trim().length < 3) {
      setLocalError("Username must be at least 3 characters")
      return
    }
  
    if(!/\S+@\S+\.\S+/.test(email)) {
      setLocalError('Invalid email format');
      return
    }
  
    if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/.test(password)) {
      setLocalError('Password must be at least 8 characters long and include at least one capital letter and one number')
      return
    }
    if(password !== confirPassword) {
      setLocalError('Passwords do not match')
      return
    }
    
    const result = await dispatch(registerUser({username, email, password}))
  
    if(registerUser.fulfilled.match(result)) {
      navigate('/login')
    }
  }
      useEffect (()=> {
      if (localError) {
        const timer = setTimeout (() => setLocalError(''), 10000)
        return () => clearTimeout(timer)
      }
    }, [localError])

    return (
      <>
      <div className="flex items-center justify-center min-h-screen">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            {(localError || error) && (
              <div className="text-error text-sm text-center">
                <span>{localError || error}</span>
              </div>
            )}
            <h2 className="card-title justify-center text-2xl"> Create Account</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <label  className="input input-bordered flex items-center gap-2 w-full">
              <input type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              />
            </label>

            <label className="input input-bordered flex items-center gap-2 w-full">
              <input type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            
            <label className="input input-bordered flex items-center gap-2 w-full">
              <input type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <label className="input input-bordered flex items-center gap-2 w-full">
              <input type="password"
              placeholder="Confirm password"
              value={confirPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
            <button type="submit" className="btn btn-neutral w-full mt-2">Sign Up</button>

          </form>
          </div>
        </div>
      </div>
      </>
    )
  }
