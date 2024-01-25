import React, { useContext, useEffect, useState } from 'react';
import BookCard from '../../components/BookCard';
import { useParams } from 'react-router-dom';
import CartBtn from '../../components/CartBtn';
import { ReviewStars } from '../../components/ReviewStars';
import DeleteBtnAdmin from '../../components/DeleteBtnAdmin';
import DeleteBook from '../../components/DeleteBook';
import { Context } from '../../context/Context';
import UpdateBtnAdmin from '../../components/UpdateBtnAdmin';
import UpdateBook from '../../components/UpdateBook';

export default function SingleBook() {
  const [reviews, setReviews] = useState(null);
  const [singleBook, setSingleBook] = useState(null);
  const { user, bookToUpdate, bookToDelete } = useContext(Context);
  const { id } = useParams();
  const { title } = useParams();

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
        <div>
          <div>
            <BookCard book={singleBook} />
            <CartBtn book={singleBook} />
            {user?.role === 'admin' && <UpdateBtnAdmin book={singleBook} />}
            {user?.role === 'admin' && <DeleteBtnAdmin book={singleBook} />}
            {bookToUpdate?._id === singleBook._id && (
              <UpdateBook book={singleBook} />
            )}
            {bookToDelete?._id === singleBook._id && (
              <DeleteBook book={singleBook} />
            )}
          </div>
          <h2>{singleBook.title}</h2>
          <p>{singleBook.author}</p>
          <h3>Details</h3>
          <p>
            Publisher: <span>{singleBook.publisher}</span>
          </p>
          <p>
            Published: <span>{singleBook.year}</span>
          </p>
          <p>
            Number of pages: <span>{singleBook?.pages}</span>
          </p>
          <p>
            ISBN: <span>{singleBook.ISBN}</span>
          </p>
          <h3>Book description</h3>
          <p>{singleBook.description}</p>
          <h3>Reviews</h3>
          <div>
            {reviews &&
              reviews.map((review) => {
                return (
                  <div key={review._id}>
                    <h3>{review?.userId?.firstName}</h3>
                    <ReviewStars rating={review.rating} />
                    <p>{review?.text}</p>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
}
