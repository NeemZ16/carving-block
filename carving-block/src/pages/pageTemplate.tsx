// import { useState } from 'react'
import Header from '../components/header';
import WalletDetails from '../components/walletDetails';
import YourBookings from '../components/yourBookings';

type PageProps = {
  ptitle: string;
  children: any;
};

function Page({ ptitle, children }: PageProps) {

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
          <YourBookings />
        </aside>
      </div>
    </>
  )
}

export default Page
