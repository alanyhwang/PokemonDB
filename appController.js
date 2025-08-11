const express = require('express');
const appService = require('./appService');

const router = express.Router();

// API endpoints
router.get('/health/db', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    res.json({ status: isConnect ? 'connected' : 'unable to connect' });
});


//Pokemon

router.get('/pokemon', async (req, res) => {
    const tableContent = await appService.fetchPokemonFromDb();
    res.json({data: tableContent});
});

//insert pokemon
router.post('/pokemon', async (req, res) => {
    const { pokemonid, pokemondescription, pokemonname, typename, abilityID, moveID } = req.body;
    const insertResult = await appService.insertPokemon(pokemonid, pokemondescription, pokemonname, typename, abilityID, moveID);
    if (insertResult) res.status(201).json({ success: true });
    else res.status(500).json({ success: false });
});

//delete pokemon
router.delete('/pokemon/:id', async (req, res) => {
    const deleteResult = await appService.deletePokemon(req.params.id);
    if (deleteResult) res.json({ success: true });
    else res.status(500).json({ success: false });
});

// pokemon attributes

router.get('/pokemon/types', async (req, res) => {
    const tableContent = await appService.fetchTypeNameFromDb();
    res.json({ data: tableContent });
});

router.get('/pokemon/abilities', async (req, res) => {
    const tableContent = await appService.fetchAbilitiesFromDb();
    res.json({ data: tableContent });
});

router.get('/pokemon/ids', async (req, res) => {
    const tableContent = await appService.fetchPokemonIDFromDb();
    res.json({ data: tableContent });
});

router.get('/pokemon/types/effectiveness', async (req, res) => {
    const attributes = req.query.attributes ? req.query.attributes.split(',') : [];
    if (!attributes.length) return res.status(400).json({ error: 'No attributes provided' });
    try {
        const tableContent = await appService.fetchTypesEffectParamsFromDb(attributes);
        res.json({ data: tableContent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// moves

router.get('/moves', async (req, res) => {
    try {
        const attributes = req.query.attributes ? req.query.attributes.split(',') : [];
        if (attributes.length === 0) {
            return res.status(400).json({ error: 'No attributes provided' });
        }

        const tableContent = await appService.fetchMoveAttributesFromDb(attributes);
        res.json({ data: tableContent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/moves/ids', async (req, res) => {
    const tableContent = await appService.fetchMoveIDFromDb();
    res.json({ data: tableContent });
});

router.get('/gyms', async (req, res) => {
    const tableContent = await appService.fetchGymTrainersFromDb();
    res.json({ data: tableContent });
});

router.get('/stats/average-winning', async (req, res) => {
    const attributes = req.query.attributes;
    const tableContent = await appService.fetchAverageWinningAggregate(attributes);
    res.json({ data: tableContent });
});

router.get('/items', async (req, res) => {
    const tableContent = await appService.fetchItemFromDB();
    res.json({ data: tableContent });
});

router.get('/items/types', async (req, res) => {
    const tableContent = await appService.fetchItemTypeFromDb();
    res.json({ data: tableContent });
});

router.get('/items/count-by-type', async (req, res) => {
    const tableContent = await appService.fetchItemCountByType();
    res.json({ data: tableContent });
});

router.get('/pokemart', async (req, res) => {
    const tableContent = await appService.fetchMartFromDB();
    res.json({data: tableContent});
});

router.get('/pokemart/filter', async (req, res) => {
    const { itemType, minQuantity } = req.query;
    const tableContent = await appService.fetchPokeMartByTypeAndMin(itemType, minQuantity);
    res.json({ data: tableContent });
});



module.exports = router;