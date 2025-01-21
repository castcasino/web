export default (_position) => {
    if (_position === '0') {
        return 'LOW / LEFT'
    } else if (_position === '1') {
        return 'HIGH / RIGHT'
    }
}
