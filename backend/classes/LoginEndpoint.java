import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.internal.GsonBuildConfig;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.stream.Collectors;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Handler for verifying a login
 *
 * @author Gavin Tersteeg
 */

public class LoginEndpoint extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/html");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        String requestData = req.getReader().lines().collect(Collectors.joining());
        String error = "";

        GsonBuilder builder = new GsonBuilder();
        builder.setPrettyPrinting();
        Gson gson = builder.create();

        NotexUserDatabase dbase = gson.fromJson(readFile("/var/notex/users.json", Charset.defaultCharset()), NotexUserDatabase.class);
        NotexLoginRequest user = gson.fromJson(requestData, NotexLoginRequest.class);

        if (user != null && dbase.login(user)) {
            out.println("{ \"response\": \"Success\"}");
        } else {
            out.println("{ \"response\": \"Failed\"}");
        }


    }

    private static void writeFile(String path, String data) {
        try {
            FileWriter fw = new FileWriter(path, false);
            BufferedWriter bw = new BufferedWriter(fw);
            bw.write(data);
            bw.close();
        } catch (Exception e) {
            // Do nothing
        }
    }

    private static String readFile(String path, Charset encoding) {
        try {
            byte[] encoded = Files.readAllBytes(Paths.get(path));
            return new String(encoded, encoding);
        } catch (Exception e) {
            // Do nothing
        }

        return "";
    }
}

