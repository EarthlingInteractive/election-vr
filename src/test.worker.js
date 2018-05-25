onmessage = (e) => {
    console.log('Message received from main script', e.data[0], e.data[1]);
    const workerResult = `Result: (${e.data[0]} * ${e.data[1]})`;
    console.log('Posting message back to main script');
    postMessage(workerResult);
};
