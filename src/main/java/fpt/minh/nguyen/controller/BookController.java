package fpt.minh.nguyen.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import fpt.minh.nguyen.dataset.Book;
import fpt.minh.nguyen.exception.NullBookException;
import fpt.minh.nguyen.service.BookService;

@Controller
public class BookController {

	@Autowired
	private BookService bookService;

	@RequestMapping(value = "/book/add", method = RequestMethod.GET)
	public String openBookRegistrationScreen(Model model, @ModelAttribute("book") Book book) {
		System.out.println(" openBookRegistrationScreen");
		book.setId(null);
		book.setName(null);
		book.setPage(null);
		book.setPublisher(null);

		return "book/book_registration";
	}

	@RequestMapping(value = "/book", method = RequestMethod.GET)
	public String openBookListScreen(Model model) {
		try {
		System.out.println("Open book list");
		List<Book> bookList = bookService.findAllBooks();
		model.addAttribute("bookList", bookList);

		
		}
		catch (Exception e) {
			System.out.println("Error");
			e.printStackTrace();
		}
		return "book/book_list";
	}

	@RequestMapping(value = "/book/edit", method = RequestMethod.GET)
	public String openBookEditScreen(Model model, @ModelAttribute("book") Book book, @RequestParam(name = "id") int id) {
		System.out.println(" openBookditScreen id = " + id);
		Book foundBook = bookService.findBook(id);
		System.out.println("id = " + foundBook.getId());
		model.addAttribute("book", foundBook);

		return "book/book_edit";

	}

	@RequestMapping(value = "/book/add", method = RequestMethod.POST, consumes = "application/x-www-form-urlencoded; charset=UTF-8", produces = "text/html; charset=UTF-8")
	public String registerBook(Model model, @ModelAttribute Book book) {
		System.out.println(" registerBook");
		System.out.println("book page = " + book.getPage());
		book = bookService.createBook(book);

		// 3. return
		return "redirect:/book";
	}

	@RequestMapping(value = "/book/edit", method = RequestMethod.POST, consumes = "application/x-www-form-urlencoded; charset=UTF-8", produces = "text/html; charset=UTF-8")
	public String editBook(Model model, @ModelAttribute Book book) throws NullBookException {
		System.out.println(" openBookRegistrationScreen");
		Book bookT = bookService.findBook(book.getId());
		if (bookT == null) {
			throw new NullBookException();
		}
		System.out.println("page = " + book.getPage());
		System.out.println("publisher = " + book.getPublisher());
		System.out.println("page = " + book.getPage());
		book = bookService.updateBook(book.getId(), book);
		return "redirect:/book";
	}

	@RequestMapping(value = "/book/delete", method = RequestMethod.POST, produces = "text/html; charset=UTF-8")
	public String deleteBook(Model model, @RequestParam(value = "id") int id) {
		System.out.println(" deleteBook");
		Book searchedBook = bookService.findBook(id);
		if (searchedBook != null) {
			bookService.deleteBook(id);
		}

		return "redirect:/book";
	}
}
