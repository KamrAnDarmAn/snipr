import React from 'react'
import { Button } from './ui/button'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from './theme-provider'

const ThemeChangerButton = () => {
    const { theme, setTheme } = useTheme();
    return (
        // justify-${theme === 'light' ? 'end' : 'start'} 
        <article className={`w-32 transition-all  bg-gray-100 dark:bg-[#181E29] shadow-lg flex justify-${theme === 'dark' ? 'start' : 'end'}  rounded-full fixed right-2 rotate-90`}>
            <Button className="w-20 " onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                {
                    theme === 'dark' ? (<><Moon /> Dark</>) : <> <Sun /> Light</>
                }
            </Button>
        </article>
    )
}

export default ThemeChangerButton