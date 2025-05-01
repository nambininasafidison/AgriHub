import Image from "next/image"

export default function FeaturedProductImage() {
  return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[50%] h-[80%] relative">
      <Image
        src="/placeholder.svg?height=400&width=400"
        alt="Premium Vanilla Pods"
        width={400}
        height={400}
        className="object-contain"
      />

      {/* Static decorative circles instead of animated ones */}
      <div className="absolute top-[10%] right-[20%] w-3 h-3 rounded-full bg-gray-300"></div>
      <div className="absolute top-[20%] left-[10%] w-4 h-4 rounded-full bg-gray-300"></div>
      <div className="absolute bottom-[30%] right-[10%] w-3 h-3 rounded-full bg-agri-green"></div>
      <div className="absolute bottom-[10%] left-[30%] w-4 h-4 rounded-full bg-agri-green"></div>
      <div className="absolute bottom-[5%] right-[40%] w-3 h-3 rounded-full bg-gray-300"></div>

      {/* Center indicator */}
      <div className="absolute bottom-[-5%] left-1/2 -translate-x-1/2">
        <div className="w-6 h-6 border-2 border-gray-300 rotate-45"></div>
      </div>
    </div>
  )
}
