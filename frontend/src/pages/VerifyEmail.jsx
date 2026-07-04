import { useState, useEffect } from "react"
import {useDispatch, useSelector} from "react-redux"
import {useNavigate} from "react-router-dom"
import { verifyEmail, sendCodeNewCode } from "../features/auth/authThunk"


export default function VerifyEmail () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {status, error, user} = useSelector((state)=> state.auth)

  const [code, setCode] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [localError, setLocalError] = useState('')

  const handleSubmit = async(e) => {
    e.preventDefault()
    setLocalError(null)


    if(code.trim().length !==6) {
      setLocalError('Verification code must be only 6 digits')
      return
    }
      const result = await dispatch(verifyEmail({email: user.email, code: code.trim()}))
      if(verifyEmail.fulfilled.match(result)) {
        setCode('')
        navigate('/login')
      }  
    }
    useEffect (()=> {
      if (localError) {
        const timer = setTimeout (() => setLocalError(''), 10000)
        return () => clearTimeout(timer)
      }
    }, [localError])

    const handleResend = async() => {
      const result = await dispatch(sendCodeNewCode({email: user.email}))
      if(sendCodeNewCode.fulfilled.match(result)){
        setSuccessMsg('New code sent! Check your email')
      }
    } 



  return (
    <>
    <div className=" flex items-center justify-center min-h-screen">
      <div className=" card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          {(localError || error) && (
            <div className="text-error text-sm text-center">
                <span>{localError || error}</span>
            </div>
          )}
          {successMsg && (
            <div className="text-success text-sm text-center">{setSuccessMsg}</div>
          )}
          <h2 className="card-title justify-center text-2xl"> Verify your email</h2>
          <p className="text-sm text-center opacity-70">
            We sent a code to {user?.email}
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <label htmlFor="">
              <input type="text"
              className="input input-bordered w-full"
              placeholder="code"
              value={code}
              onChange={(e)=> setCode(e.target.value)}
            />
            </label>
            <button type="submit" className="btn btn-neutral w-full mt-2">Verify</button>
            <p className="text-center text-sm mt-2">
              Didn't get the code? <button className="link link-primary " onClick={handleResend}>Resend</button>    
            </p>
          </form>
        </div>
      </div>
    </div>
    </>
  )

}

