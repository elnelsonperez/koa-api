export const areWeTestingWithJest = () => {
    return process.env.JEST_WORKER_ID !== undefined;
};
