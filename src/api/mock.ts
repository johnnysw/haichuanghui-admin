// Mock API utilities
export const mockResponse = <T>(data: T, delay = 0): Promise<T> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), delay);
  });
};

export const mockError = (message: string, delay = 0): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), delay);
  });
};

// Mock data exports
export const mapJson = () =>
  Promise.resolve({
    data: [
      { lng: 116.405285, lat: 39.904989, id: 1, name: "北京" },
      { lng: 121.473701, lat: 31.230416, id: 2, name: "上海" }
    ]
  });
export const formUpload = (data: any) =>
  Promise.resolve({ success: true, data: { url: "" } });

export default {
  mockResponse,
  mockError,
  mapJson,
  formUpload
};
