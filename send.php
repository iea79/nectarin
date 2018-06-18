<?php
    $to = $_POST['mail_recipient'];
    $subject = $_POST['subject'];

    $message = '
                <html>
                    <head>
                        <title>' . $subject . '</title>
                    </head>
                    <body>
                        <p>Пакет(если указан): ' . $_POST['package_name'] . '</p>                        
                        <p>Телефон: ' . $_POST['tel'] . '</p>                        
                    </body>
                </html>'; 
    $headers = "Content-type: text/html; charset=utf-8 \r\n"; //Кодировка письма
    $headers .= "From: Отправитель " . $to . "\r\n"; //Наименование и почта отправителя
    if (mail($to, $subject, $message, $headers)) {
        echo 'success';
    } else {
        echo 'error';
    }
?>