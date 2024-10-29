
package com.claz.repositories;

import com.claz.models.Cart;
import com.claz.models.Customer;
import com.claz.models.Reply;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface replyRepository extends JpaRepository<Reply, Integer> {
	List<Reply> findByCommentId(int commentId);
}
