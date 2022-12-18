const router = require('express').Router();

router.get('', (req, res) => {
    return res.json({ message: "indexed called" })
})

module.exports = router;