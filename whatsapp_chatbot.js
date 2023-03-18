const {
  Client,
  LocalAuth,
  Buttons,
  List,
  MessageMedia,
  DefaultOptions,
} = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const mongoose = require("mongoose");
const timeZone = require("mongoose-timezone");
const dotenv = require("dotenv");
const ChatGPT = require("./chatgpt");

dotenv.config();

// Chat GPT
const bot = new ChatGPT(process.env.OPENAI_API_KEY);

// ============= MongoDB (START) =============
async function connect_db(uri) {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
    // get reference to database
    let db = mongoose.connection;
  } catch (error) {
    console.log(error);
  }
}

const uri = "mongodb://127.0.0.1:27017/whatsapp_chatbot";
connect_db(uri);
// define Schema
const UserSchema = mongoose.Schema({
  user_id: String,
  last_welcome_message_date: String,
  is_client: Boolean,
  has_permissons: Boolean,
  is_client_date: String,
  has_permissons_date: String,
});
// set the correct time zone
UserSchema.plugin(timeZone, { paths: ["date", "subDocument.subDate"] });
// compile schema to model
const UserModel = mongoose.model("User", UserSchema, "users");
// ============= MongoDB (END) =============

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.initialize();

const name_store = "Códigos Oxford Learn 2023 ©";

const send_welcome_message = (client, chat_id) => {
  const buttons = new Buttons(
    `¡Hola 👋, Gracias por comunicarte con Códigos Oxford Learn 😀!
\nPor favor seleccione una de las siguientes opciones:`,
    [{ body: "Código Oxford Learn" }, { body: "Código Oxford Solver" }],
    name_store,
    "Tienda certificada"
  );

  client.sendMessage(chat_id, buttons);
};

const send_product_oxford_learn_list = (client, chat_id) => {
  const sections = [
    {
      title: "Niveles",
      rows: [
        { title: "Básico 1 a 6", description: "CELEN UNA PUNO" },
        { title: "Básico 7 a 12", description: "CELEN UNA PUNO" },
        {
          title: "Pre intermedio 1 a 6",
          description: "CELEN UNA PUNO",
        },
        { title: "Intermedio 1 a 5", description: "CELEN UNA PUNO" },
        { title: "Superior 1 a 5", description: "CELEN UNA PUNO" },
        { title: "Avanzando 1 a 5", description: "CELEN UNA PUNO" },
      ],
    },
  ];
  const list = new List(
    "Seleccione el nivel para el cual desea adquirir el código de la plataforma Oxford Learn",
    "Niveles",
    sections,
    name_store,
    "Tienda certificada"
  );
  client.sendMessage(chat_id, list);
};

const send_message_product_oxford_learn_item = async (
  client,
  chat_id,
  name_nivel,
  program_name
) => {
  const media = await MessageMedia.fromFilePath(
    `images/codes_mockup/${program_name}.png`
  );

  await client.sendMessage(chat_id, media);

  const buttons = new Buttons(
    `*.: Información :.*
--------------------------
📝| *Nivel:* ${name_nivel}
⏳| *Duración:* 18 meses
💰| *Costo:* S/.48,00

✅Compra segura✅

Por su compra recibira de regalo un código para la extensión *Oxford Solver* valido por un mes!`,
    [{ body: "Formas de pago" }],
    name_store,
    "Tienda certificada"
  );

  client.sendMessage(chat_id, buttons);
};

const send_formas_pago_message = (client, chat_id) => {
  client.sendMessage(
    chat_id,
    `*.: Formas de pago :.*
--------------------------
🔒| *YAPE:* +51 938544411
🔒| *Banco de la Nación:* 04-221-496154
🔒| *BCP:* 5330 4689 3800 63 

*Nota 1:* Para la cuenta del BN; se aceptan transferencias por cualquier medio: _Agente, Banca movil, etc_.
*Nota 2:* Para la cuenta BCP; solo se aceptan transferencias por _Banca móvil_ (importante).

🤝| Cuentas a nombre de Deyvis M. Lacuta

ℹ️| Por favor seguido de realizar el pago envie la foto del voucher o captura como comprobante, para proceder a enviarle el código por este medio.

Si tiene alguna consulta, puede escribirla a continuación, le estaremos respondiendo lo mas pronto posible, gracias.`
  );
};

const send_product_oxford_solver = async (client, chat_id) => {
  const media = await MessageMedia.fromFilePath("images/oxford_solver.jpg");
  await client.sendMessage(chat_id, media, {
    caption:
      "*Oxford Solver* es una _extensión web_ que facilita la resolución de la plataforma Oxford Learn _descifrando_ las respuestas de las distintas actividades.",
  });

  const buttons = new Buttons(
    `*.: Información Oxford Solver :.*
--------------------------
📝| *Nivel:* Cualquiera
💰| *Costo:* 
▫️ 1 mes → S/.7 
▫️ 2 meses → S/.13
▫️ 3 meses → S/.20

✅Compra segura✅`,
    [
      { body: "Tutorial Oxford Solver" },
      { body: "Formas de pago Oxford Solver" },
    ],
    name_store,
    "Tienda certificada"
  );

  client.sendMessage(chat_id, buttons);
};

const send_tutorial_oxford_solver_message = (client, chat_id) => {
  const message = `📺| *Tutorial:* Como usar Oxford Solver
https://www.youtube.com/watch?v=n0CdRhm_BeQ

🌐| *Oxford Solver:* https://chrome.google.com/webstore/detail/oxford-solver/jjaofbljcgijjlchgokmgklecjjccabl

*Nota:* Se recomienda el uso del navegador _Chrome_ para evitar inconvenientes.`;
  client.sendMessage(chat_id, message);
};

const send_books_list = (client, chat_id) => {
  const sections = [
    {
      title: "Libros",
      rows: [
        {
          title: "Básico 1 a 6",
          description: "American English File 2ed Level Starter",
        },
        {
          title: "Básico 7 a 12",
          description: "American English File 2ed Level 1",
        },
        {
          title: "Pre intermedio 1 a 6",
          description: "American English File 2ed Level 2",
        },
        {
          title: "Intermedio 1 a 5",
          description: "American English File 2ed Level 3",
        },
        {
          title: "Superior 1 a 5",
          description: "American English File 2ed Level 4",
        },
        {
          title: "Avanzando 1 a 5",
          description: "American English File 2ed Level 5",
        },
      ],
    },
  ];
  const list = new List(
    "Seleccione un libro",
    "Libros",
    sections,
    name_store,
    "Tienda certificada"
  );
  client.sendMessage(chat_id, list);
};

const send_book_item = async (client, chat_id, details) => {
  const { book_data, name_cover, id_button } = details;

  const media = await MessageMedia.fromFilePath(
    `images/books_mockup/${name_cover}`
  );
  await client.sendMessage(chat_id, media, {
    caption: `📚 *${book_data.name_book}* 📚

◻️| *Nivel:* ${book_data.nivel}
◻️| *Libros:* ${book_data.url_books}
◻️| *Audios:* ${book_data.url_audios}
◻️| *Videos:* ${book_data.url_videos}

Adquiere tu código para la plataforma Oxford Learn en nuestra tienda: ${book_data.url_oxford_code}`,
  });

  // Se procede a comentar por que la libreria no permite enviar archivos pesados :(
  const buttons = new Buttons(
    `Seleccione una opción`,
    [
      { id: `${id_button}_sb`, body: "Descargar Student Book" },
      { id: `${id_button}_wb`, body: "Descargar Workbook" },
    ],
    name_store,
    "Tienda certificada"
  );

  client.sendMessage(chat_id, buttons);
};

const send_book_file = async (client, chat_id, id_button) => {
  /* No working: la libreria solo permite enviar ficheros de poco tamaño (aprox menos de 5mb) */
  if (!id_button) return;

  let name_book = "";
  let url_oxford_code = "";

  switch (id_button) {
    case "download_aef_starter_sb":
      name_book = "American English File 2e Level Starter - Student Book.pdf";
      url_oxford_code = "https://bit.ly/3xRgkuC";
      break;
    case "download_aef_starter_wb":
      name_book = "American English File 2e Level Starter - Workbook.pdf";
      url_oxford_code = "https://bit.ly/3xRgkuC";
      break;
    case "download_aef_1_sb":
      name_book = "American English File 2e Level 1 - Student Book.pdf";
      url_oxford_code = "https://bit.ly/37Rx8af";
      break;
    case "download_aef_1_wb":
      name_book = "American English File 2e Level 1 - Workbook.pdf";
      url_oxford_code = "https://bit.ly/37Rx8af";
      break;
    case "download_aef_2_sb":
      name_book = "American English File 2e Level 2 - Student Book.pdf";
      url_oxford_code = "https://bit.ly/3F1W7DP";
      break;
    case "download_aef_2_wb":
      name_book = "American English File 2e Level 2 - Workbook.pdf";
      url_oxford_code = "https://bit.ly/3F1W7DP";
      break;
    case "download_aef_3_sb":
      name_book = "American English File 2e Level 3 - Student Book.pdf";
      url_oxford_code = "https://bit.ly/3FmJSSl";
      break;
    case "download_aef_3_wb":
      name_book = "American English File 2e Level 3 - Workbook.pdf";
      url_oxford_code = "https://bit.ly/3FmJSSl";
      break;
    case "download_aef_4_sb":
      name_book = "American English File 2e Level 4 - Student Book.pdf";
      url_oxford_code = "https://bit.ly/3yhqBQU";
      break;
    case "download_aef_4_wb":
      name_book = "American English File 2e Level 4 - Workbook.pdf";
      url_oxford_code = "https://bit.ly/3yhqBQU";
      break;
    case "download_aef_5_sb":
      name_book = "American English File 2e Level 5 - Student Book.pdf";
      url_oxford_code = "https://bit.ly/3MSKFx5";
      break;
    case "download_aef_5_wb":
      name_book = "American English File 2e Level 5 - Workbook.pdf";
      url_oxford_code = "https://bit.ly/3MSKFx5";
      break;
    default:
      return;
  }

  const media = await MessageMedia.fromFilePath(`pdfs/books/${name_book}`);

  await client.sendMessage(
    chat_id,
    "Por favor espere, el libro se esta enviando... :D"
  );

  await client
    .sendMessage(chat_id, media, {
      caption: `🏷️| Adquiere tu código para la plataforma _Oxford Learn_ en nuestra tienda: ${url_oxford_code}`,
    })
    .then((response) => {
      console.log("El archivo se envio exitosamente!");
    })
    .catch((err) => {
      console.log("Problemas al enviar el archivo :(");
      console.log(err);
    });
};

const make_client = async (client, chat_id, user_id) => {
  // verificar si existe en la db
  let found_user = await UserModel.findOne({
    user_id: user_id,
  });

  if (found_user) {
    found_user = await UserModel.findOne({
      user_id: user_id,
      is_client: true,
    });
    if (found_user) {
      // si existe y ya es cliente solo actualizar has_permissons y has_permissons_date
      await UserModel.findOneAndUpdate(
        { user_id: user_id },
        {
          has_permissons: true,
          has_permissons_date: new Date().toString(),
        }
      );
    } else {
      // si existe actualizar is_client a true y has_permissons = true
      await UserModel.findOneAndUpdate(
        { user_id: user_id },
        {
          is_client: true,
          is_client_date: new Date().toString(),
          has_permissons: true,
          has_permissons_date: new Date().toString(),
        }
      );
    }
  } else {
    // si no existe crear un nuevo user con el valor client true y has_permissons = true
    create_user(
      user_id,
      new Date().toString(),
      true,
      true,
      new Date().toString(),
      new Date().toString()
    );
  }

  client.sendMessage(chat_id, "El usuario fue actualizado exitosamente!");
};

const give_permissons = async (client, chat_id, user_id) => {
  // verificar si existe en la db
  let found_user = await UserModel.findOne({
    user_id: user_id,
  });

  if (found_user) {
    await UserModel.findOneAndUpdate(
      { user_id: user_id },
      {
        has_permissons: true,
        has_permissons_date: new Date().toString(),
      }
    );
  } else {
    // si no existe crear un nuevo user con el valor has_permissons = true
    create_user(
      user_id,
      new Date().toString(),
      false,
      true,
      null,
      new Date().toString()
    );
  }

  client.sendMessage(chat_id, "Se otorgaron los permisos exitosamente!");
};

const get_user_type = async (found_user, chat_id) => {
  const has_permissons = found_user?.has_permissons ?? false;

  const user_type =
    chat_id === "51938544411@c.us"
      ? "admin"
      : has_permissons === true
      ? "with_permissions"
      : "no_permissions";

  return user_type;
};

const main = async (message) => {
  const chat = await message.getChat();
  const is_group = chat.isGroup;
  let user_id = is_group ? message.id.participant : message.from; // phone number
  let chat_id = message.fromMe ? message.to : message.from; // work for both dm or groups

  let found_user = await UserModel.findOne({
    user_id: user_id,
  });

  const user_type = await get_user_type(found_user, user_id); // tipo de permisos

  console.log("user_type", user_type);

  let details = null;

  const send_welcome_msg = is_group
    ? false
    : await get_send_welcome_message(found_user, user_id);

  if (send_welcome_msg === true && user_type !== "admin") {
    send_welcome_message(client, chat_id);
    await update_last_welcome_message_date(chat_id);
    console.log("User last welcome message date updated successfully!");
  } else {
    // prepareting the message.body for the switch
    if (message.body.startsWith("!gpt ")) {
      // chat gpt adition
      question = message.body.replace("!gpt ", "").trim();
      if (question !== "") {
        message.body = "!gpt";
      } else {
        console.log("Error, la pregunta esta vacia");
        return;
      }
    } else if (
      message.body.startsWith("¡Muchas gracias por preferirnos!") &&
      !is_group
    ) {
      message.body = "!make_client";
    } else if (message.body.startsWith("!make_client ")) {
      phone_number = message.body.replace(/\D/g, ""); // only keep the digits
      try {
        user_id = await client.getNumberId(phone_number);
        user_id = user_id._serialized;
      } catch {
        console.log("Error, el numero es invallido.");
        return;
      }
      console.log("-> user_id", user_id);
      message.body = "!make_client";
    } else if (message.body.startsWith("!give_permissons ")) {
      phone_number = message.body.replace(/\D/g, ""); // only keep the digits
      try {
        user_id = await client.getNumberId(phone_number);
        user_id = user_id._serialized;
      } catch {
        console.log("Error, el numero es invallido.");
        return;
      }
      console.log("-> user_id", user_id);
      message.body = "!give_permissons";
    }

    switch (message.body) {
      case "!welcome":
        if (!is_group && user_type === "admin") {
          send_welcome_message(client, chat_id);
        } else {
          console.log("No eres admi xd");
        }
        break;
      case "!books":
        if (user_type === "admin" || user_type === "with_permissions") {
          send_books_list(client, chat_id);
        } else {
          console.log("No eres admi xd");
        }
        break;
      case "Básico 1 a 6\nAmerican English File 2ed Level Starter":
        details = {
          book_data: {
            name_book: "American English File Starter",
            nivel: "Básico 1 - 6",
            url_books: "https://bit.ly/39aUUOD",
            url_audios: "https://bit.ly/3Ms7Jma",
            url_videos: "https://bit.ly/36UMWIJ",
            url_oxford_code: "https://bit.ly/3xRgkuC",
          },
          name_cover: "aef_starter.png",
          id_button: "download_aef_starter",
        };
        send_book_item(client, chat_id, details);
        break;
      case "Básico 7 a 12\nAmerican English File 2ed Level 1":
        details = {
          book_data: {
            name_book: "American English File 1",
            nivel: "Básico 7 - 12",
            url_books: "https://bit.ly/3EUkLGy",
            url_audios: "https://bit.ly/3KlOusV",
            url_videos: "https://bit.ly/3OJigLG",
            url_oxford_code: "https://bit.ly/37Rx8af",
          },
          name_cover: "aef_1.png",
          id_button: "download_aef_1",
        };
        send_book_item(client, chat_id, details);
        break;
      case "Pre intermedio 1 a 6\nAmerican English File 2ed Level 2":
        details = {
          book_data: {
            name_book: "American English File 2",
            nivel: "Pre intermedio 1 - 6",
            url_books: "https://bit.ly/3KHuQYN",
            url_audios: "https://bit.ly/3kre1qa",
            url_videos: "https://bit.ly/3kre7y2",
            url_oxford_code: "https://bit.ly/3F1W7DP",
          },
          name_cover: "aef_2.png",
          id_button: "download_aef_2",
        };
        send_book_item(client, chat_id, details);
        break;
      case "Intermedio 1 a 5\nAmerican English File 2ed Level 3":
        details = {
          book_data: {
            name_book: "American English File 3",
            nivel: "Intermedio 1 - 5",
            url_books: "https://bit.ly/3LS8uF2",
            url_audios: "https://bit.ly/3w4KBDH",
            url_videos: "https://bit.ly/39usjE6",
            url_oxford_code: "https://bit.ly/3FmJSSl",
          },
          name_cover: "aef_3.png",
          id_button: "download_aef_3",
        };
        send_book_item(client, chat_id, details);
        break;
      case "Superior 1 a 5\nAmerican English File 2ed Level 4":
        details = {
          book_data: {
            name_book: "American English File 4",
            nivel: "Superior 1 - 5",
            url_books: "https://bit.ly/3KTKf8a",
            url_audios: "https://bit.ly/3KQi8Xq",
            url_videos: "https://bit.ly/3yniJgK",
            url_oxford_code: "https://bit.ly/3yhqBQU",
          },
          name_cover: "aef_4.png",
          id_button: "download_aef_4",
        };
        send_book_item(client, chat_id, details);
        break;
      case "Avanzando 1 a 5\nAmerican English File 2ed Level 5":
        details = {
          book_data: {
            name_book: "American English File 5",
            nivel: "Avanzado 1 - 5",
            url_books: "https://bit.ly/3sgFcIE",
            url_audios: "https://bit.ly/3Fo36al",
            url_videos: "https://bit.ly/387Nn32",
            url_oxford_code: "https://bit.ly/3MSKFx5",
          },
          name_cover: "aef_5.png",
          id_button: "download_aef_5",
        };
        send_book_item(client, chat_id, details);
        break;
      case "Descargar Student Book":
      case "Descargar Workbook":
        send_book_file(client, chat_id, message.selectedButtonId);
        break;
      case "Código Oxford Learn":
        if (!is_group) {
          send_product_oxford_learn_list(client, chat_id);
        }
        break;
      case "Código Oxford Solver":
        if (!is_group) {
          send_product_oxford_solver(client, chat_id);
        }
        break;
      case "Básico 1 a 6\nCELEN UNA PUNO":
        send_message_product_oxford_learn_item(
          client,
          chat_id,
          "Básico 1 a 6",
          "a1"
        );
        break;
      case "Básico 7 a 12\nCELEN UNA PUNO":
        send_message_product_oxford_learn_item(
          client,
          chat_id,
          "Básico 7 a 12",
          "a2"
        );
        break;
      case "Pre intermedio 1 a 6\nCELEN UNA PUNO":
        send_message_product_oxford_learn_item(
          client,
          chat_id,
          "Pre intermedio 1 a 6",
          "b1"
        );
        break;
      case "Intermedio 1 a 5\nCELEN UNA PUNO":
        send_message_product_oxford_learn_item(
          client,
          chat_id,
          "Intermedio 1 a 5",
          "b1+"
        );
        break;
      case "Superior 1 a 5\nCELEN UNA PUNO":
        send_message_product_oxford_learn_item(
          client,
          chat_id,
          "Superior 1 a 5",
          "b2"
        );
        break;
      case "Avanzando 1 a 5\nCELEN UNA PUNO":
        send_message_product_oxford_learn_item(
          client,
          chat_id,
          "Avanzando 1 a 5",
          "c1"
        );
        break;
      case "!pagos":
      case "Formas de pago":
      case "Formas de pago Oxford Solver":
        if (!is_group) {
          send_formas_pago_message(client, chat_id);
        }
        break;
      case "Tutorial Oxford Solver":
        send_tutorial_oxford_solver_message(client, chat_id);
        break;
      case "!make_client":
        if (user_type === "admin") {
          make_client(client, chat_id);
        } else {
          console.log("No eres admi xd");
        }
        break;
      case "!give_permissons":
        if (user_type === "admin") {
          give_permissons(client, chat_id, user_id);
        } else {
          console.log("No eres admi xd");
        }
        break;
      case "!gpt":
        if (
          (is_group && user_type === "admin") ||
          user_type === "with_permissions"
        ) {
          chat_gpt(message, question);
        } else {
          console.log("No tienes permisos");
        }
        break;
      default:
        break;
    }
  }
};

const chat_gpt = async (message, question) => {
  try {
    const answer = await bot.ask(question);
    message.reply(answer.trim());
  } catch {
    console.log("ChatGPT no working :(");
  }
};

// when a message is sended include my own messages
client.on("message_create", async (message) => {
  console.log("Mensaje entrante");
  main(message);
});

// ======== Auxiliary functions ========
const days_to_current_date = (date) => {
  const last_welcome_message_date = new Date(date).getTime();
  const current_date = new Date().getTime();

  const days = Math.floor(
    Math.abs(current_date - last_welcome_message_date) / 86400000
  );

  return days;
};

const create_user = (
  user_id,
  last_welcome_message_date,
  is_client,
  has_permissons,
  is_client_date,
  has_permissons_date
) => {
  // a document instance
  const user = new UserModel({
    user_id: user_id,
    last_welcome_message_date:
      last_welcome_message_date ?? new Date().toString(),
    is_client: is_client,
    has_permissons: has_permissons,
    is_client_date: is_client_date,
    has_permissons_date: has_permissons_date,
  });

  // save model to database
  user.save();
};

const get_send_welcome_message = async (user, user_id) => {
  let send_welcome_msg = true;
  const min_num_days = 40; // to send a new welcome message

  if (!user) {
    create_user(user_id, new Date().toString(), false, false, null, null);
  } else if (
    days_to_current_date(user.last_welcome_message_date) < min_num_days
  ) {
    send_welcome_msg = false;
  }

  return send_welcome_msg;
};

const update_last_welcome_message_date = async (user_id) => {
  const result = await UserModel.findOneAndUpdate(
    { user_id: user_id },
    { last_welcome_message_date: new Date().toString() }
  );
  return result;
};
