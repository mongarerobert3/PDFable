
/******Test endpoint *********/
https://gist.githubusercontent.com/SidneyAllen/bd390d5599117d7141e2e479f02d9957/raw/89e91a9484cf3451ac0da11cd752cb8b6cb96d64/openapi-array-of-objects.json



/*******************************************/
/**************Overloads the data state to be optimized****************/
useEffect(() => {
  const fetchData = async () => {
    try {
      let fetchedData = [];
      if (url) {
        const response = await axios.get(url);
        fetchedData = response.data;
      } else {
        const libData = await fetchData();
        setData(libData);
        //setFilteredData(fetchedData);
      }
      setData(fetchedData);
    } catch (error) {
      console.log('Fetch Error', error);
    }
  };

  fetchData();
}, [url]);

/**************************************************/
/**************************************************/
/**************************************************/



/*************Fetches Url Data replaced with the one that fetches both local and url data*******///

		useEffect(() => {
      const fetchData = async () => {
        if (url) {
          // Fetch data from external URL
          const urlSearch = await axios.get(url);
          setUrlData(urlSearch.data);
        }
        if (localFilePath) {
          // Fetch data from local JSON file
          const localFileSearch = await axios.get(`file://${localFilePath}`);
          setLocalFileData(localFileSearch.data);
        }
      };
    
      // Call fetchData when either url or localFilePath changes
      fetchData();
    }, [url, localFilePath]);


/**************************************************/
/**************************************************/
/******************Title section********************************/
<section className="text-gray-600 body-font">
        <div className="container px-5 py-5 mx-auto">
          <div className="flex flex-col text-center w-full">
            <h1 
              id='header'
              className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Alpha Vantage Income Statement
            </h1>
          </div>
        </div>
      </section>