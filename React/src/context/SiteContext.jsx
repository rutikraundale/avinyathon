import { createContext, useContext, useState, useEffect } from "react";
import { getSites, pingAppwrite } from "../../appwrite/services/site.service";

const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
  const [selectedSite, setSelectedSite] = useState(null);
  const [sites, setSites] = useState([]);

  const fetchSites = async () => {
    try {
      await pingAppwrite();
      const response = await getSites();
      setSites(response.documents || []);
      if (response.documents?.length > 0 && !selectedSite) {
        setSelectedSite(response.documents[0]);
      }
    } catch (error) {
      console.error("Error fetching sites:", error);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  return (
    <SiteContext.Provider value={{ selectedSite, setSelectedSite, sites, setSites, fetchSites }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);