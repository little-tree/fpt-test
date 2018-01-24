package fpt.minh.nguyen.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import fpt.minh.nguyen.dataset.Impression;
import fpt.minh.nguyen.repository.ImpressionRepository;

@Service
public class ImpressionServiceImpl implements ImpressionService {

	@Autowired
	private ImpressionRepository impressionRepository;

	@Override
	public Impression createImpression(Impression impression) {
		return impressionRepository.save(impression);
	}

	@Override
	public Impression updateImpression(int id, Impression impression) {
		return impressionRepository.save(impression);
	}

	@Override
	public int deleteImpression(int id) {
		impressionRepository.delete(id);
		return 0;
	}

	@Override
	public Impression findImpression(int id) {
		return impressionRepository.findOne(id);
	}

	@Override
	public List<Impression> findAllImpressionsByBookId(String bookId) {
		return impressionRepository.findAllImpressionWithBookId(bookId);
	}
}
