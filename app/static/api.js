async function unBooking(id) {
    const response = await fetch(`${baseUri}/api/reservation.delete?id=${id}`);
    return response.text();
}
async function booking(id,userId) {
    const response = await fetch(`${baseUri}/api/reservation.insert?id=${id}&userId=${userId}`);
    return response.text();
}

async function queryBooking(id,userId) {
    const response = await fetch(`${baseUri}/api/reservation.query?id=${id}&userId=${userId}`);
    return response.text();
}
