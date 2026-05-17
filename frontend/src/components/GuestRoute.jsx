import {useSelector} from "react-redux"
import { Navigate } from "react-router-dom"

export default function GuestRoute ({children}) {
  const {accessToken} = useSelector((state) => state.auth)

  if(accessToken) {
    return <Navigate to='/' />
  }
  return children
}