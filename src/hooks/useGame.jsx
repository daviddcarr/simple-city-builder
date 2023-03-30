import create from 'zustand'

const getLocalStorage = (key) => JSON.parse(window.localStorage.getItem(key))
const setLocalStorage = (key, value) => window.localStorage.setItem(key, JSON.stringify(value))

const createEmptyGrid = (size) => {
  const grid = new Array(size)
  for( let i = 0; i < size; i++ ) {
    grid[i] = new Array(size).fill(null)
  }
  return grid
}

export const useGame = create((set) => {

    const gridSize = 100

    return {
        gridSize: gridSize,

        playerMode: 'idle',
        setPlayerMode: (mode) => set({ playerMode: mode }),
        togglePlayerMode: () => set((prev) => ({ playerMode: prev.playerMode === 'idle' ? 'build' : 'idle' })),

        playerCurrency: getLocalStorage('playerCurrency') || 100,
        setPlayerCurrency: (currency) => set({ playerCurrency: currency }),
        addPlayerCurrency: (amount) => set((prev) => ({ playerCurrency: prev.playerCurrency + amount })),

        playerBlocks: getLocalStorage('playerBlocks') || createEmptyGrid(gridSize),
        setPlayerBlocks: (blocks) => set({ playerBlocks: blocks }),
        addPlayerBlock: (block) => {
            set((prev) => ({ playerBlocks: [...prev.playerBlocks, block]}))
        },

        saveCity: () => {
            set((prev) => {
                setLocalStorage('playerCurrency', prev.playerCurrency)
                setLocalStorage('playerBlocks', prev.playerBlocks)
            })
        },

        resetCity: () => {
            set({
                playerCurrency: 100,
                playerBlocks: createEmptyGrid(10),
            })
        }

    }
})