'use client'

import { useEffect, useState } from 'react'
interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[]
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed'
        platform: string
    }>
    prompt(): Promise<void>
}

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [showInstall, setShowInstall] = useState(false)

    useEffect(() => {
        const handler = (e: Event) => {
            const promptEvent = e as BeforeInstallPromptEvent
            e.preventDefault?.()
            setDeferredPrompt(promptEvent)
            setShowInstall(true)
        }

        window.addEventListener('beforeinstallprompt', handler)

        return () => {
            window.removeEventListener('beforeinstallprompt', handler)
        }
    }, [])

    const handleInstallClick = async () => {
        if (!deferredPrompt) return

        deferredPrompt.prompt()
        const choiceResult = await deferredPrompt.userChoice

        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt')
        } else {
            console.log('User dismissed the install prompt')
        }

        setShowInstall(false)
    }

    if (!showInstall) return null

    return (
        <div className="fixed bottom-4 right-4 bg-white border px-4 py-2 rounded shadow z-50">
            <p className="mb-2">Install this app?</p>
            <button
                onClick={handleInstallClick}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
            >
                Install
            </button>
        </div>
    )
}
