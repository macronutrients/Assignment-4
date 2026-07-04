import {create} from "zustand";
import {persist} from "zustand/middleware";

type Theme = "light"|"dark";
type Density = "compact"|"comfortable";
type UiStore={
    theme: Theme, density: Density, toggleTheme: ()=>void, setDensity: (density: Density) => void,
};

export const useUiStore = create<UiStore>()(
    persist(
        (set)=>({
            theme: "light", density: "comfortable", toggleTheme: ()=> set((state) => ({
                theme: state.theme === "light" ? "dark":"light"
            })),
            setDensity: (density)=>set({density})
        }),
        {
            name: "myshelf.ui", partialize: (state)=>({
                theme:state.theme, density:state.density
            })
        }
    )
);