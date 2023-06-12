import { type VoidComponent } from 'solid-js'
import { A } from 'solid-start'

const Home: VoidComponent = () => {
  return (
    <div class='flex flex-col gap-2 items-center my-16'>
      <A href='/mutation'>Mutation</A>
      <A href='/query'>CSR Query</A>
      <a href='/query'>Query</a>
    </div>
  )
}

export default Home
