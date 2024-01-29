import React, { useContext, useEffect, useState } from 'react';
import BookCard from '../../components/bookCard/BookCard';
import { useParams } from 'react-router-dom';
import CartBtn from '../../components/CartBtn';
import { ReviewStars } from '../../components/ReviewStars';
import DeleteBtnAdmin from '../../components/DeleteBtnAdmin';
import DeleteBook from '../../components/deleteBook/DeleteBook';
import { Context } from '../../context/Context';
import UpdateBtnAdmin from '../../components/UpdateBtnAdmin';
import UpdateBook from '../../components/updateBook/UpdateBook';
import './singleBook.css';

export default function SingleBook() {
  const [reviews, setReviews] = useState(null);
  const [singleBook, setSingleBook] = useState(null);
  const { user, bookToUpdate, bookToDelete } = useContext(Context);
  const { id } = useParams();

  const fetchReviews = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_REVIEWS_SINGLE_BOOK}/${id}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.success) setReviews(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBook = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BOOK_BY_ID}${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) setSingleBook(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBook();
    fetchReviews();
  }, []);

  return (
    <>
      {singleBook && (
        <div className='singleBook-page'>
          <div className='bookcard-and-btns-container'>
            <BookCard book={singleBook} />
            <div className='cart-and-admin-btns-container'>
              <CartBtn book={singleBook} />
              {user?.role === 'admin' && <UpdateBtnAdmin book={singleBook} />}
              {user?.role === 'admin' && <DeleteBtnAdmin book={singleBook} />}
            </div>
          </div>
          {bookToUpdate?._id === singleBook._id && (
            <UpdateBook book={singleBook} />
          )}
          {bookToDelete?._id === singleBook._id && (
            <DeleteBook book={singleBook} />
          )}

          <div className='singleBook-details'>
            <h2 className='singleBook-title'>{singleBook.title}</h2>
            <p>by {singleBook.author}</p>
            <h3 className='singleBook-heading'>Details</h3>
            <p>
              <span className='singleBook-span'> Publisher:</span>{' '}
              {singleBook.publisher}
            </p>
            <p>
              <span className='singleBook-span'>Published: </span>
              {singleBook.year}
            </p>
            <p>
              <span className='singleBook-span'> Number of pages: </span>
              {singleBook?.pages}
            </p>
            <p>
              <span className='singleBook-span'>ISBN: </span>
              {singleBook.ISBN}
            </p>
            <h3 className='singleBook-heading'>Book description</h3>
            <p>{singleBook.description}</p>
            <h3 className='singleBook-heading'>Reviews</h3>
            <div>
              {reviews &&
                reviews.map((review) => {
                  return (
                    <div key={review._id}>
                      <h3>{review?.userId?.firstName}</h3>
                      <ReviewStars rating={review.rating} />
                      <p className='singleBook-review-text'>{review?.text}</p>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
