import useFetchData from "../../utils/useFetchData";

export default function Module1() {
    const { data, loading } = useFetchData("module1")

    if (!data || loading) {
        return (
            <div className="flex h-full items-center justify-center bg-[#D5D5D8] font-medium text-gray-400">
				Chargement des régions...
			</div>
        )
    }
};
