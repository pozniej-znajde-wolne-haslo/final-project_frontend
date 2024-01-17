import { useContext, useEffect, useState } from 'react';
import { Context } from '../context/Context';
import FirstName from '../components/FirstName';
import LastName from '../components/LastName';
import Image from '../components/Image';
import Upload from '../components/Upload';
import Form from '../components/Form';
import Email from '../components/Email';
import Password from '../components/Password';
import ReEnter from '../components/ReEnter';
import CombinedName from '../components/CombinedName';
import { useNavigate } from 'react-router-dom';
import AddReviewForm from '../components/AddReviewForm';

export default function Profile() {
  const { user, setUser } = useContext(Context);
  const [userOrders, setUserOrders] = useState([]);
  const navigate = useNavigate();
  // states for writing/editing reviews:
  const [userReviews, setUserReviews] = useState([]);
  const [bookToReview, setBookToReview] = useState('');
  const [reviewExists, setReviewExists] = useState(false);
  const [renderOrders, setRenderOrders] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      async function userOrders() {
        try {
          const response = await fetch(`${import.meta.env.VITE_USER_ORDERS}`, {
            method: 'GET',
            headers: { token: token },
          });
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              console.log(data.data);
              setUserOrders(data.data);
            }
          }
        } catch (error) {
          //
        }
      }
      userOrders();
      // fetch reviews by userId
      async function userReviews() {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_REVIEWS_BY_USER_ID}`,
            {
              method: 'GET',
              headers: { token: token },
            }
          );
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              console.log(data.data);
              setUserReviews(data.data);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
      userReviews();
    }
  }, []);

  // fetch reviews again, whenever one gets submitted:
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      async function userReviews() {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_REVIEWS_BY_USER_ID}`,
            {
              method: 'GET',
              headers: { token: token },
            }
          );
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              console.log(data.data);
              setUserReviews(data.data);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
      userReviews();
    }
  }, [reviewExists]);

  async function uploadBook(e) {
    e.preventDefault();
    try {
      const book = new FormData(e.target);
      const token = sessionStorage.getItem('token');
      if (token) {
        const response = await fetch(`${import.meta.env.VITE_UPLOAD_BOOK}`, {
          method: 'POST',
          headers: { token: token },
          body: book,
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            console.log(data.message);
          }
        }
      }
    } catch (error) {
      //
    }
  }
  const handleDelete = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (token) {
        const response = await fetch(
          `${import.meta.env.VITE_DELETE_USER}${user._id}`,
          { method: 'DELETE', headers: { token: token } }
        );
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUser(null);
            sessionStorage.removeItem('token');
            navigate('/deletedAccount');
          }
        }
      }
    } catch (error) {}
  };

  return (
    <>
      {user?.image?.thumbnail && <img src={user?.image?.thumbnail} alt='' />}
      <h2>{user?.firstName}</h2>
      <div>
        <Form update='Upload a Profile Image'>
          <Image />
        </Form>
        <Form update='Update Your First Name'>
          <FirstName />
        </Form>
        <Form update='Update Your Last Name'>
          <LastName />
        </Form>
        <Form update='Update Your Email'>
          <Email />
        </Form>
        <Form update='Update Your Password'>
          <Password />
          <ReEnter />
        </Form>
      </div>
      <div>
        <p onClick={() => setRenderOrders(renderOrders ? false : true)}>
          Orders
        </p>
        {renderOrders &&
          userOrders.map((item) => {
            return (
              <div key={item._id}>
                {item.books.map((book) => {
                  return (
                    <div className='order-item' key={book._id}>
                      <img src={book.image.thumbnail} alt='cover' />
                      <p>"{book.title}", </p>
                      <p>{book.author}</p>
                      <p>{book.price} €</p>

                      {userReviews.find((rev) => rev.book === book._id) ? (
                        <>
                          <button>Edit your review</button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() =>
                              setBookToReview(
                                bookToReview === '' ? book.title : ''
                              )
                            }
                          >
                            Write a review
                          </button>
                          {bookToReview === book.title && (
                            <AddReviewForm
                              book={book}
                              reviewExists={reviewExists}
                              setReviewExists={setReviewExists}
                              setBookToReview={setBookToReview}
                            />
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
      <div>
        {user?.role === 'admin' && (
          <form onSubmit={uploadBook}>
            <fieldset>
              <legend>Upload a Book</legend>
              <div>
                <label htmlFor='title'>Title</label>
                <input type='text' name='title' id='title' />
              </div>
              <CombinedName />
              <div>
                <label htmlFor='year'>Year</label>
                <input type='number' name='year' id='year' />
              </div>
              <div>
                <label htmlFor='publisher'>Publisher</label>
                <input type='text' name='publisher' id='publisher' />
              </div>
              <div>
                <label htmlFor='genre'>Genre</label>
                <input type='text' name='genre' id='genre' />
              </div>
              <div>
                <label htmlFor='description'>Description</label>
                <textarea
                  name='description'
                  id='description'
                  cols='30'
                  rows='10'
                ></textarea>
              </div>
              <div>
                <label htmlFor='price'>Price</label>
                <input type='number' step='any' name='price' id='price' />
              </div>
              <div>
                <label htmlFor='isbn'>ISBN</label>
                <input type='text' name='isbn' id='isbn' />
              </div>
              <Image />
              <Upload />
            </fieldset>
          </form>
        )}
      </div>
      <div>
        <button onClick={handleDelete}>DELETE YOUR ACCOUNT</button>
      </div>
    </>
  );
}
