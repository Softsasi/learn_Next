import { verifyEmailAction } from '../actions';


const verifyEmail = async ({searchParams}: {searchParams: Promise<{code: string}>}) => {
  const {code} = await searchParams;

  const verifyResult = await verifyEmailAction(code);


  return (
    <div>verify {code}</div>
  )
}

export default verifyEmail
