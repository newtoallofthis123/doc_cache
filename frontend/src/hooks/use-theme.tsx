export default function useTheme(){
    const setTheme = () => {
        const theme = localStorage.getItem("theme")

        if (theme === "light") {
            document.documentElement.classList.remove("dark")
            localStorage.setItem("theme", theme)
        } else if(theme=="dark") {
            document.documentElement.classList.add("dark")
            localStorage.setItem("theme", theme)
        } else if(theme=="system") {
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                document.documentElement.classList.add("dark")
                localStorage.setItem("theme", theme)
            } else {
                document.documentElement.classList.remove("dark")
                localStorage.setItem("theme", theme)
            }
        }
    }

    return typeof window !== "undefined" ? setTheme : null
}