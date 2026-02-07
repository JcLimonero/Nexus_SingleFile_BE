<?php                                                                                                              
  $host = '127.0.0.1';                                                                                               
  $user = 'root';                                                                                                    
  $pass = 'root';                                                                                             
  $db = 'single_file';                                                                                               
  $port = 3306;                                                                                                      
                                                                                                                     
  $conn = new mysqli($host, $user, $pass, $db, $port);                                                               
                                                                                                                     
  if ($conn->connect_error) {                                                                                        
      die("Error: " . $conn->connect_error);                                                                         
  } else {                                                                                                           
      echo "Conexion exitosa a MySQL";                                                                               
  }                                                                                                                  
  $conn->close(); 