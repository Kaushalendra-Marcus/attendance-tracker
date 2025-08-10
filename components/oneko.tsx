"use client"
import { useEffect } from 'react'

const OnekoCat = () => {
    useEffect(() => {
        const script = document.createElement("script")
        script.src = '/oneko.js'
        script.async = true
        document.body.appendChild(script)
        return ()=>{
            document.body.removeChild(script)
        }
    }, [])
    return null
}

export default OnekoCat
