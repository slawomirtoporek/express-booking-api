import { useDispatch, useSelector } from 'react-redux';
import { getConcerts, loadConcertsRequest } from '../../../redux/concertsRedux';
import { Alert, Container } from 'reactstrap';
import { useEffect } from 'react';

const Prices = () => {
  const dispatch = useDispatch();
  const concerts = useSelector(getConcerts);

  useEffect(() => {
    dispatch(loadConcertsRequest());
  }, [dispatch]);

  return (
    <Container>
      <h1>Prices</h1>
      <p>Prices may differ according the day of the festival. Remember that ticket includes not only the star performance, but also 10+ workshops. We gathered several genre teachers to help you increase your vocal skills, as well as self confidence.</p>
      
      <Alert color="info">
          Attention! <strong>Children under 4 can go freely with you without any other fee!</strong>
      </Alert>

      <h2>Day one</h2>
      <p>Price: { concerts[0] && concerts[0].price ? concerts[0].price : 'n/a' }$</p>
      <p>Workshops: "Rock Music Style", "How to make you voice grooowl", "Make your voice stronger", "History of Rock"</p>
      <h2>Day Two</h2>
      <p>Price: { concerts[1] && concerts[1].price ? concerts[1].price : 'n/a' }$</p>
      <p>Workshops: "Find your real tune", "Find your real YOU", "Fell the music", "Jam session"</p>
      <h2>Day three</h2>
      <p>Price: { concerts[2] && concerts[2].price ? concerts[2].price : 'n/a' }$</p>
      <p>Workshops: "Increase your vocal range", "How to properly warmup before singing", "It's time for YOU!"</p>
    </Container>
  )
};

export default Prices;