package fpt.minh.nguyen.service;

import java.util.List;

import fpt.minh.nguyen.dataset.Book;

public interface BookService {
	
	Book createBook(Book book);

	Book updateBook(int id, Book book);

	int deleteBook(int id);

	Book findBook(int id);

	List<Book> findAllBooks();
}
