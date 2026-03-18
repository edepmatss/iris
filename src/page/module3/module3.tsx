import useFetchData from "../../utils/useFetchData";

export default function Module3() {
    const { data, loading } = useFetchData("module3");
    if(!data || loading) {
        return (
            <div className="flex h-full items-center justify-center bg-[#D5D5D8] font-medium text-gray-400">
				Chargement du Module 3...
			</div>
        )
    }
};
