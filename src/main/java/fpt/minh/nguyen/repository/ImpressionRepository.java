package fpt.minh.nguyen.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import fpt.minh.nguyen.dataset.Impression;

/**
 * This class designs these persistence access for impression_tbl table.
 */
@Repository
public interface ImpressionRepository extends JpaRepository<Impression, Integer> {
	/**
	 * this method is used to get list of NoticeInformation with status.
	 * @param status the registration_status
	 * @return List of NoticeInformation
	 */
	@Query(value = "SELECT n.id, n.name, n.book_id FROM impression_tbl n WHERE book_id = :bookId ORDER BY n.id ASC", nativeQuery = true)
	List<Impression> findAllImpressionWithBookId(@Param("bookId") String bookId);

}
