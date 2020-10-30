# WeHelp

## How to run this project

1. Intall expo on your mobile device and install npm on your computer.

2. ``` shell
   git clone https://github.com/dliang090222/WeHelp
   ```
3. ``` shell
   npm install
   ```
4. ``` shell
   npm start
   ```
5. scan the QR code using your mobile device.

## Making requests
 <details>
  <summary>sign in to server **POST**</summary>
  
| body | return |
| ------------- | ------------- |
| func="signIn" | UID |
| email  | coins  |
|   | icon  |
|   | rating |
|   | UID |

</details>

 <details>
  <summary>send message **POST**</summary>

| body | return |
| ------------- | ------------- |
| func="sendMessage" |  success: boolean |
| message |   |
| senderUID  |  |
| receiverUID |   |

</details>

 <details>
  <summary>post task **POST**</summary>

| body | return |
| ------------- | ------------- |
| func="postTask" |  success: boolean |
| title |   |
| description  |  |
| UID |   |
| receiverUID |
| imageArray | |

</details>
