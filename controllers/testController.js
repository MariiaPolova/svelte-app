exports.sendTestMsg = (req, res, next) => {
    res.status(200).json({message: "Successful test!"})
}