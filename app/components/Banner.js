import Image from 'next/image';

const Banner = () => {
  return (
    <div className="w-full h-auto flex justify-center items-center bg-gray-200">
      <div className="w-full max-w-7xl mx-auto">
        <Image
          src="/banner.png" // Yahan apne image ka path dijiye
          alt="Banner Image"
          layout="responsive"
          width={1200} // Actual width
          height={500} // Actual height
          className="rounded-lg shadow-lg" // Optional styling for rounded corners and shadow
        />
      </div>
    </div>
  );
};

export default Banner;
