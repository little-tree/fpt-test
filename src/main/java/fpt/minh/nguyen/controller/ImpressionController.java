package fpt.minh.nguyen.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import fpt.minh.nguyen.dataset.Book;
import fpt.minh.nguyen.dataset.Impression;
import fpt.minh.nguyen.exception.NullBookException;
import fpt.minh.nguyen.service.BookService;
import fpt.minh.nguyen.service.ImpressionService;

@Controller
public class ImpressionController {

	@Autowired
	private BookService bookService;

	@Autowired
	private ImpressionService impressionService;

	@RequestMapping(value = "/impression/add/{bookId}", method = RequestMethod.GET)
	public String openImpressionRegistrationScreen(Model model, @PathVariable("bookId") int bookId,
			@ModelAttribute("impression") Impression impression) {
		// check if book existed logic....

		impression.setId(null);
		impression.setName(null);
		impression.setBookId(bookId);

		return "impression/impression_registration";
	}

	@RequestMapping(value = "/impression/{bookId}", method = RequestMethod.GET)
	public String openImpressionListScreen(Model model, @PathVariable("bookId") String bookId) {
		List<Impression> impressionList = impressionService.findAllImpressionsByBookId(bookId);
		model.addAttribute("impressionList", impressionList);
		model.addAttribute("bookId", bookId);

		return "impression/impression_list";
	}

	@RequestMapping(value = "/impression/edit/{bookId}", method = RequestMethod.GET)
	public String openImpressionEditScreen(Model model, @ModelAttribute("impression") Impression impression,
			@PathVariable("bookId") int bookId, BindingResult result,
			@RequestParam(name = "id") int id) {
		Book foundBook = bookService.findBook(bookId);
		if (foundBook != null) {
			Impression foundImpression = impressionService.findImpression(id);
			model.addAttribute("impression", foundImpression);
		}
		return "impression/impression_edit";

	}

	@RequestMapping(value = "/impression/add/{bookId}", method = RequestMethod.POST, consumes = "application/x-www-form-urlencoded; charset=UTF-8", produces = "text/html; charset=UTF-8")
	public String registerImpression(Model model, @ModelAttribute Impression impression,
			@PathVariable("bookId") String bookId) {
		Book foundBook = bookService.findBook(Integer.parseInt(bookId));
		if (foundBook != null) {
			impressionService.createImpression(impression);
		}
		// 3. return
		return "redirect:/impression/" + bookId;
	}

	@RequestMapping(value = "/impression/edit/{bookId}", method = RequestMethod.POST, consumes = "application/x-www-form-urlencoded; charset=UTF-8", produces = "text/html; charset=UTF-8")
	public String editImpression(Model model, @ModelAttribute Impression impression, BindingResult result,
			@PathVariable("bookId") int bookId) throws NullBookException {
		Book bookT = bookService.findBook(bookId);
		if (bookT == null) {
			throw new NullBookException();
		}
		if (impression == null) {
			System.out.println("impression null");
		}
		impressionService.updateImpression(impression.getId(), impression);

		return "redirect:/impression/" + bookId;
	}

	@RequestMapping(value = "/impression/delete/{bookId}", method = RequestMethod.POST, produces = "text/html; charset=UTF-8")
	public String deleteImpression(Model model, @RequestParam(value = "id") int id,
			@PathVariable("bookId") int bookId) {
		impressionService.deleteImpression(id);

		return "redirect:/impression/" + bookId;
	}

}
