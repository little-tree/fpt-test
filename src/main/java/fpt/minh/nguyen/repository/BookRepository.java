package fpt.minh.nguyen.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fpt.minh.nguyen.dataset.Book;

/**
 * This class designs these persistence access for book_tbl table.
 */
@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {

}
