package com.sms.service.admin;


import com.sms.entity.Role;
import com.sms.entity.User;

import com.sms.repository.UserRepository;


import org.springframework.stereotype.Service;


import java.util.List;



@Service
public class AdminUserService {



private final UserRepository repository;



public AdminUserService(
        UserRepository repository
){

    this.repository=repository;

}





public List<User> getAllUsers(){


return repository.findAll();


}







public User updateRole(
        Long id,
        Role role
){



User user =
repository.findById(id)

.orElseThrow(

()->new RuntimeException(
"User not found"
)

);



user.setRole(role);



return repository.save(user);


}








public void deleteUser(
        Long id
){


User user =
repository.findById(id)

.orElseThrow(

()->new RuntimeException(
"User not found"
)

);



repository.delete(user);


}



}