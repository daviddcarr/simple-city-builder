export const blocks = [
    {
        name: 'highrise',
        title: 'Highrise',
        cost: 50,
        currencyPerPeriod: 25,
        currencyPeriod: 10,
    },
    {
        name: 'factory',
        title: 'Factory',
        cost: 150,
        currencyPerPeriod: 10,
        currencyPeriod: 15,
    },
    {
        name: 'park',
        title: 'Park',
        cost: 100,
        currencyPerPeriod: -30,
        currencyPeriod: 60,
    },
    {
        name: 'highway',
        title: 'Road',
        cost: 5,
        currencyPerPeriod: -5,
        currencyPeriod: 60,
    },
    {
        name: 'highway2',
        title: '3 Way',
        cost: 10,
        currencyPerPeriod: -5,
        currencyPeriod: 60,
    },
    {
        name: 'highway3',
        title: 'Crossroads',
        cost: 15,
        currencyPerPeriod: -5,
        currencyPeriod: 60,
    },
    {
        name: 'highwayL',
        title: 'Turn',
        cost: 15,
        currencyPerPeriod: -5,
        currencyPeriod: 60,
    },

]

export const getBlock = (name) => {
    return blocks.find((block) => block.name === name)
}

export const calculateProceduralHighrise = () => {
    const maxHeight = 15

    let currentCount = 4
    let iterationsAtCurrent = 0
    let resultArray = []
    
    while (currentCount > 0 && resultArray.length < maxHeight) {
      // Test whether we're gonna stay at current
      const testStaying = Math.random()
      
      // Chances of staying at current, still on the fence
      //const chanceOfStaying = 1 / (iterationsAtCurrent + 1)
      const chanceOfStaying = 1 - ((iterationsAtCurrent + 1) * 0.1)
      
      // Chances of dropipng by more than 1
      const chanceOfDouble = 0.25
      
      if (testStaying > chanceOfStaying) {
         const testDrop = Math.random()
         if (currentCount > 1 && testDrop < chanceOfDouble) {
           currentCount = currentCount - Math.ceil(Math.random() * currentCount)
         } else {
           currentCount--
         }
         if (currentCount !== 0) {
           resultArray.push(currentCount)  
         }
         iterationsAtCurrent = 0
      } else {
         resultArray.push(currentCount)
         iterationsAtCurrent++ 
      }
    }

    return resultArray
}

export const getRandomHighriseTexture = () => {
    const textures = [
        "BrickModern",
        "BrickOld",
        "BrickWhite",
        "GlassBlue",
        "GlassPanel",
        "GlassWhite",
        "PanelBlack",
        "PanelWhite",
        // Add new texture folders here
    ]
    const randomIndex = Math.floor(Math.random() * textures.length)
    return textures[randomIndex]
}