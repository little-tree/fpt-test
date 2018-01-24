package fpt.minh.nguyen.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.stereotype.Service;

import fpt.minh.nguyen.dataset.Book;
import fpt.minh.nguyen.repository.BookRepository;

@Service
public class BookServiceImpl implements BookService {

	@Autowired
	private BookRepository bookRepository;
	
	@Override
	public Book createBook(Book notice) {
		return bookRepository.save(notice);
	}

	@Override
	public Book updateBook(int id, Book book) {
		return bookRepository.save(book);
	}

	@Override
	public int deleteBook(int id) {
		bookRepository.delete(id);
		return 0;
	}

	@Override
	public Book findBook(int id) {
		return bookRepository.findOne(id);
	}

	@Override
	public List<Book> findAllBooks() {
		return bookRepository.findAll(sortBook());
	}
	
	/**
	 * Utility function to sort Book object.
	 * @return Sort object
	 */
	private Sort sortBook() {
		Order id= new Order(Sort.Direction.DESC, "id");
        return new Sort(id);
    }
	
}
