package fpt.minh.nguyen.service;

import java.util.List;

import fpt.minh.nguyen.dataset.Impression;

public interface ImpressionService {

	Impression createImpression(Impression impression);

	Impression updateImpression(int id, Impression impression);

	int deleteImpression(int id);

	Impression findImpression(int id);

	List<Impression> findAllImpressionsByBookId(String bookId);
}
