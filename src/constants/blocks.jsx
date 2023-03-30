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

]

export const getBlock = (name) => {
    return blocks.find((block) => block.name === name)
}
