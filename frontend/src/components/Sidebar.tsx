export default function Sidebar() {
    return (
        <div className="w-60 border-r p-4 flex flex-col">
            <h2 className="font-bold m-4">My Docs</h2>
            <button className="border rounded p-2 mb-4 cursor-pointer">Upload PDF</button>
            <div className="flex-1 space-y-2 overflow-y-auto">
                <div className="p-2 rounded bg-gray-100 cursor-pointer">Sample.pdf</div>
            </div>
        </div>
    )
}