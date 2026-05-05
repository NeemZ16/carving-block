// import { useState } from 'react'
import Header from '../components/header';
import WalletDetails from '../components/walletDetails';
import YourBookings from '../components/yourBookings';
import type { ProjectListingProps } from '../components/projListing';

type PageProps = {
  ptitle: string;
  children: any;
};

function Page({ ptitle, children }: PageProps) {

  const listings: ProjectListingProps[] = [
    {
      id: "2",
      title: "Item with no description",
      price: 500,
      duration: 90,
      image: "",
      booked: true,
      time: new Date(),
      state: 1,
    },
    {
      id: "3",
      title: "Item with description",
      price: 500,
      duration: 90,
      image: "",
      booked: true,
      time: new Date(),
      description: "Required tools: A B C D E F. Difficulty level: beginner?? fih.",
      state: 1,
    },
    {
      id: "4",
      title: "Whittled Bear",
      price: 250,
      duration: 30,
      image: "",
      booked: true,
      time: new Date(),
      state: 1,
    },
  ]

  return (
    <>
      <Header />
      <div id="content">
        <main>
          <h1>{ptitle}</h1>
          {children}
        </main>
        <hr className='dashed vert' />
        <aside>
          <WalletDetails />
          <hr className='dashed' />
          <YourBookings bookings={listings} />
        </aside>
      </div>
    </>
  )
}

export default Page
