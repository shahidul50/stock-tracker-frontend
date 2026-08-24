    
// URL Params Update Helper Function
  export const updateQueryParams = (newParams: Record<string, string | number | null>, setSearchParams: any) => {
    setSearchParams((prevParams: string | string[][] | Record<string, string> | URLSearchParams | undefined) => {
      const updatedParams = new URLSearchParams(prevParams);

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === "" || value === undefined) {
          updatedParams.delete(key);
        } else {
          updatedParams.set(key, String(value));
        }
      });

      return updatedParams; 
    });
  };