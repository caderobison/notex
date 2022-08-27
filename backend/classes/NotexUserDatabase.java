import java.util.ArrayList;

public class NotexUserDatabase {

    private ArrayList<NotexUser> users;

    public NotexUserDatabase() {
        users = new ArrayList<>();
    }

    public void add(NotexUser u) {
        if (!exists(u)) users.add(u);
    }

    public boolean exists(NotexUser u) {
        if (u.getUsername() == null) return false;

        for (NotexUser c : users) if (c.getUsername().equals(u.getUsername())) return true;

        return false;
    }
    
    public NotexUser getUser(String user) {
        for (NotexUser c : users) if (c.getUsername().equals(user)) return c;

        return null;
    }

    public boolean login(NotexLoginRequest u) {
        if (u.getUsername() == null || u.getPassword() == null) return false;

        for (NotexUser c : users) if (c.getUsername().equals(u.getUsername()) && c.getPassword().equals(u.getPassword())) return true;

        return false;
    }
}
